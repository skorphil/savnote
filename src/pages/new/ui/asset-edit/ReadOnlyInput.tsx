type ReadOnlyInputProps = {
  value: string | number;
  label: string;
};
/**
 * New component
 *
 */
export function ReadOnlyInput(props: ReadOnlyInputProps) {
  const { label, value } = props;
  return (
    <div className="min-h-[56px] mx-4 py-5 flex flex-col">
      <div className="text-xs text-md-light-on-surface-variant dark:text-md-dark-on-surface-variant">
        {label}
      </div>
      <div className="h-6">{value}</div>
    </div>
  );
}
