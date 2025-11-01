declare module 'react-katex' {
  import { ReactNode } from 'react';

  export interface BlockMathProps {
    math: string;
    children?: ReactNode;
  }

  export interface InlineMathProps {
    math: string;
    children?: ReactNode;
  }

  export const BlockMath: React.FC<BlockMathProps>;
  export const InlineMath: React.FC<InlineMathProps>;
}
