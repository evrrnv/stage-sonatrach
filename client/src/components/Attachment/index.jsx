import { FontIcon, Link } from "@fluentui/react";
import styles from "./style";

const Attachment = () => {
  const { link, li, closeIcon, ul } = styles;

  return (
    <ul
      className={ul}
    >
      <li className={li}>
        <FontIcon aria-label="TextDocument" iconName="TextDocument" />
        <Link className={link} href="">
          file-1.txt
        </Link>
        <FontIcon
          className={closeIcon}
          aria-label="StatusCircleErrorX"
          iconName="StatusCircleErrorX"
        />
      </li>
      <li className={li}>
        <FontIcon aria-label="TextDocument" iconName="TextDocument" />
        <Link className={link} href="">
          file-2.txt
        </Link>
        <FontIcon
          className={closeIcon}
          aria-label="StatusCircleErrorX"
          iconName="StatusCircleErrorX"
        />
      </li>
    </ul>
  );
};

export default Attachment;
