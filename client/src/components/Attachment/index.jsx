import {
  FontIcon,
  Link,
} from "@fluentui/react";
import styles from "./style";

const Attachment = ({ files, remove, onDelete, onClick }) => {
  const { link, li, closeIcon, ul } = styles;

  const attList = () => {
    return files.map((v, i) => {
      return (
        <li key={i} className={li}>
          <FontIcon aria-label="TextDocument" iconName="TextDocument" />
          <Link data-unique-name={v.uniqueName} className={link} href="" onClick={onClick}>
            {v.name}
          </Link>
          {remove && (
            <div
              file-index={i}
              onClick={onDelete}
              style={{ display: "inherit" }}
            >
              <FontIcon
                className={closeIcon}
                aria-label="StatusCircleErrorX"
                iconName="StatusCircleErrorX"
              />
            </div>
          )}

        </li>
      );
    });
  };

  return <ul className={ul}>{files && attList()}</ul>;
};

export default Attachment;
