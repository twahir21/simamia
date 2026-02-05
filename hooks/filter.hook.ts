import { ModuleType } from "@/helpers/actionHandler.help";
import { useState } from "react";

export const useGlobalFilter = () => {
  const [visible, setVisible] = useState(false);
  const [module, setModule] = useState<ModuleType>("stock");
  const [filters, setFilters] =
    useState<Record<string, string>>({});

  const open = (m: ModuleType) => {
    setModule(m);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const select = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    visible,
    module,
    filters,
    open,
    close,
    select,
  };
};
