import React from 'react'

export const useDisclosure = () => {
  const [open, setOpen] = React.useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((prev) => !prev);

  return { isOpen: open, onOpen, onClose, onToggle };
};
