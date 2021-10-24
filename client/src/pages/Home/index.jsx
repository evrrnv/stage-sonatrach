import { useMutation, useQuery } from "@apollo/client";
import {
  MarqueeSelection,
  SelectionMode,
  Stack,
  CommandBarButton,
  Selection,
  PersonaSize,
  ShimmeredDetailsList,
  DetailsRow,
  PersonaInitialsColor,
  ProgressIndicator,
  DefaultButton,
  Callout,
  FocusTrapZone,
  Calendar,
  DirectionalHint,
} from "@fluentui/react";
import { useContext, useRef, useState } from "react";
import PreviewPopup from "../../components/PreviewPopup";
import UserPersona from "../../components/UserPersona";
import CHANGE_PROBLEM_STATUS from "../../graphql/mutations/CHANGE_PROBLEM_STATUS";
import GET_PROBLEMS from "../../graphql/queries/GET_PROBLEMS";
import { UserContext } from "../../lib/GlobalProvider";
import {
  detailsList,
  eyeIcon,
  headStack,
  homeStack,
  marqueeSelection,
} from "./style";

let d = new Date();
d.setHours(0,0,0,0);

export let defaultFilterVars = {
  greaterThan: new Date(d.getTime()),
  lessThan: new Date(d.setDate(d.getDate() + 1)),
};

const Home = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [previewHidden, setPreviewHidden] = useState(true);
  const [progressHidden, setProgressHidden] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const buttonConainerRef = useRef();

  const { currentUser } = useContext(UserContext);

  const {
    loading,
    error,
    data: problemsList,
  } = useQuery(GET_PROBLEMS, {
    variables: defaultFilterVars,
  });

  const [updateProblemStatus] = useMutation(CHANGE_PROBLEM_STATUS, {
    update: (cache, { data: dataToUpdate }) => {
      const existingCache = cache.readQuery({
        query: GET_PROBLEMS,
        variables: defaultFilterVars,
      });

      const newData = JSON.parse(JSON.stringify(existingCache));

      const index = newData.allProblems.nodes.findIndex(
        (v) => v.id === dataToUpdate.updateProblemById.problem.id
      );

      newData.allProblems.nodes[index].problemStatusByStatus.name =
        dataToUpdate.updateProblemById.problem.problemStatusByStatus.name;

      cache.writeQuery({
        query: GET_PROBLEMS,
        data: newData,
        variables: defaultFilterVars
      });
    },
    onCompleted: () => {
      setProgressHidden(true);
    },
  });

  if (error) return `Error! ${error.message}`;

  const isC1 = currentUser.userRolesByUserIdList.some(
    (v) => v.roleByRoleId.code === "C1"
  );

  const moreProps = {
    items: [
      {
        key: 1,
        text: "Supprimer",
        iconProps: { iconName: "Delete" },
      },
    ],
  };

  const editProps = {
    items: [
      {
        key: "903fad01-0f26-4e2e-be3f-2e044dc01f7a",
        text: "En attente",
        iconProps: { iconName: "Clock" },
      },
      {
        key: "d21d2f10-56f2-49cd-97f7-bb652bc39eaf",
        text: "En Traitement",
        iconProps: { iconName: "Processing" },
      },
      {
        key: "e2565d00-e76c-474a-b5b3-c4b799edfd5d",
        text: "Traité",
        iconProps: { iconName: "Accept" },
      },
      {
        key: "85cb5e7e-8323-4254-8078-d6e189d3280e",
        text: "Non traitable ",
        iconProps: { iconName: "Warning" },
      },
    ],
    onItemClick: (_, item) => {
      setProgressHidden(false);
      updateProblemStatus({
        variables: {
          id: selectedItem.id,
          status: item.key,
        },
      });
    },
  };

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItem = selection.getSelection()[0];

      if (selectedItem) {
        setIsSelected(true);
        setSelectedItem(selectedItem);
      } else {
        setIsSelected(false);
      }
    },
  });

  const onUserRenderRow = ({ Utilisateur }) => {
    return (
      <UserPersona
        initialsColor={
          Utilisateur === "Moi" ? PersonaInitialsColor.teal : undefined
        }
        size={PersonaSize.size24}
        name={Utilisateur}
      />
    );
  };

  const handleClickPreview = () => setPreviewHidden(false);

  const handlePreviewCancel = () => setPreviewHidden(true);

  const formatedProblemsListData = (data) => {
    return problemsList.allProblems.nodes.map((v) => {
      const date = new Date(v.createdAt);
      const fullName =
        v.userAccountByCreatedBy.firstName +
        " " +
        v.userAccountByCreatedBy.lastName;
      return {
        id: v.id,
        userId: v.userAccountByCreatedBy.id,
        Titre: v.title,
        Date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        État: v.problemStatusByStatus.name,
        Utilisateur:
          v.userAccountByCreatedBy.id === currentUser.id ? "Moi" : fullName,
        "Pièces jointes": 0,
      };
    });
  };

  const onRenderDetailsListRow = (props) => {
    const customStyles = {};
    if (props.item.userId === currentUser.id) {
      customStyles.root = {
        backgroundColor: "#f5faff",
      };
    }

    return <DetailsRow {...props} styles={customStyles} />;
  };

  const previewPopupData = () =>
    problemsList.allProblems.nodes.find((v) => v.id === selectedItem.id);

  const toggleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onSelectDate = (date) => {
    setIsSelected(false)
    const dd = new Date(date.getTime());
    defaultFilterVars = {
      greaterThan: date,
      lessThan: new Date(dd.setDate(dd.getDate() + 1)),
    };
    setSelectedDate(date);
    hideCalendar();
  };

  const hideCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  console.log(isSelected)

  return (
    <Stack styles={homeStack}>
      <ProgressIndicator
        progressHidden={progressHidden}
        styles={{
          root: { height: "2px" },
          itemProgress: { padding: "0px 0px 8px 0px" },
        }}
      />
      <Stack horizontal horizontalAlign="space-between" styles={headStack}>
        <Stack horizontal style={{ height: "44px" }}>
          <CommandBarButton
            styles={eyeIcon}
            iconProps={{ iconName: "RedEye" }}
            text="Aperçu"
            disabled={!isSelected}
            onClick={handleClickPreview}
          />
          {!isC1 && (
            <>
              <CommandBarButton
                iconProps={{ iconName: "Edit" }}
                text="Modifier l'État"
                disabled={
                  !isSelected ||
                  (isSelected && selectedItem.userId === currentUser.id)
                }
                menuProps={editProps}
              />
              <CommandBarButton
                menuProps={moreProps}
                text="Plus"
                disabled={
                  !isSelected ||
                  (isSelected && selectedItem.userId === currentUser.id)
                }
              />
            </>
          )}
        </Stack>
        <div>
          <div ref={buttonConainerRef}>
            <DefaultButton
              onClick={toggleShowCalendar}
              text="Choisissez une date"
              iconProps={{ iconName: "Calendar" }}
            />
          </div>
          {showCalendar && (
            <Callout
              isBeakVisible={false}
              gapSpace={0}
              doNotLayer={false}
              directionalHint={DirectionalHint.bottomRightEdge}
              target={buttonConainerRef}
              onDismiss={hideCalendar}
            >
              <FocusTrapZone isClickableOutsideFocusTrap>
                <Calendar
                  onSelectDate={onSelectDate}
                  onDismiss={hideCalendar}
                  value={selectedDate}
                />
              </FocusTrapZone>
            </Callout>
          )}
        </div>
      </Stack>
      <MarqueeSelection isEnabled={false} styles={marqueeSelection}>
        <ShimmeredDetailsList
          styles={detailsList}
          items={problemsList ? formatedProblemsListData(problemsList) : []}
          selectionMode={SelectionMode.single}
          setKey="exampleList"
          columns={[
            {
              key: 1,
              name: "Titre",
              fieldName: "Titre",
              minWidth: 200,
            },
            {
              key: 2,
              name: "Utilisateur",
              fieldName: "Utilisateur",
              minWidth: 300,
              onRender: onUserRenderRow,
            },
            {
              key: 3,
              name: "Date",
              fieldName: "Date",
              minWidth: 200,
            },
            {
              key: 4,
              name: "État",
              fieldName: "État",
              minWidth: 200,
            },
            {
              key: 5,
              name: "Pièces jointes",
              fieldName: "Pièces jointes",
              minWidth: 200,
            },
          ]}
          selection={selection}
          enableShimmer={loading}
          onRenderRow={onRenderDetailsListRow}
        />
      </MarqueeSelection>
      {isSelected && (
        <PreviewPopup
          hidePreview={previewHidden}
          onCancel={handlePreviewCancel}
          data={previewPopupData()}
        />
      )}
    </Stack>
  );
};

export default Home;
