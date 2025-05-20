import { ReactNode } from 'react';
import '../styles/form-container.css';

interface Props {
  children: ReactNode;
}

export function FormContainer({ children }: Props) {
  return <div className="form-container">{children}</div>;
}
