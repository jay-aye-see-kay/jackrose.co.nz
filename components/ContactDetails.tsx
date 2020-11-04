import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";

const contactMethods = [
  {
    userLabel: "me@jackrose.co.nz",
    serviceLabel: "Email",
    href: "mailto:me@jackrose.co.nz",
    icon: <FontAwesomeIcon icon={faEnvelope} />,
  },
  {
    userLabel: "/jay-aye-see-kay",
    serviceLabel: "GitHub",
    href: "https://github.com/jay-aye-see-kay",
    icon: <FontAwesomeIcon icon={faGithub} />,
  },
  {
    userLabel: "/jay-aye-see-kay",
    serviceLabel: "Stackoverflow",
    href: "https://stackoverflow.com/users/7164888/jay-aye-see-kay",
    icon: <FontAwesomeIcon icon={faStackOverflow} />,
  },
  {
    userLabel: "/jackderryrose",
    serviceLabel: "LinkedIn",
    href: "https://linkedin.com/in/jackderryrose",
    icon: <FontAwesomeIcon icon={faLinkedin} />,
  },
];

export const ContactDetails = () => {
  return (
    <div className="mt-8">
      {contactMethods.map((props) => (
        <div
          key={props.href}
          className="py-2 grid"
          style={{ gridTemplateColumns: "1fr 30px 1fr" }}
        >
          <span className="text-right">{props.serviceLabel}</span>
          <span className="text-center">{props.icon}</span>
          <Link href={props.href}>{props.userLabel}</Link>
        </div>
      ))}
    </div>
  );
};
