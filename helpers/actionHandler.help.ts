import { ActionContext } from "@/types/globals.types";

export const useListActions = <T,>(context: ActionContext<T>) => {
  const handleExport = async () => {
    // Example: CSV export
    console.log(`Exporting ${context.module}`, context.data);

    // later:
    // exportToCSV(context.data, `${context.module}-export.csv`);
  };

  const handlePrint = () => {
    console.log(`Printing ${context.module}`, context.data);
    // printService.print(context.data)
  };

  const openFilter = () => {
    console.log(`Open filter for ${context.module}`);
    // setFilterModal({ module: context.module })
  };

  const openSort = () => {
    console.log(`Open sort for ${context.module}`);
    // setSortModal({ module: context.module })
  };

  return {
    handleExport,
    handlePrint,
    openFilter,
    openSort,
  };
};
