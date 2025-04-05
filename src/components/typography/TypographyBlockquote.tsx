import { PluginElementRenderProps } from '@yoopta/editor';

export function TypographyBlockquote(props: PluginElementRenderProps) {
  return (
    <blockquote className="mt-6 !border-l-2 pl-6 italic" {...props.attributes}>
      {props.children}
    </blockquote>
  );
}