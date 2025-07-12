import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  dataCy?: string;
  dataCyClose?: string;
};
