import React, { useEffect, useState } from "react";
import { RAlert } from "request-ui";

export const Announcement = ({
  id,
  ...props
}: {
  id: string;
  message: string;
  linkText?: string;
  link?: string;
}) => {
  const [open, setOpen] = useState(false);

  const key = `announcement-${id}`;
  useEffect(() => {
    if (!localStorage.getItem(key)) {
      setOpen(true);
    }
  }, [key]);

  const close = () => {
    setOpen(false);
    localStorage.setItem(key, "dismissed");
  };

  return open ? <RAlert severity="info" onClose={close} {...props} /> : null;
};
