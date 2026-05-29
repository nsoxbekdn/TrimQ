"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ClipboardList, Building2, ChevronRight } from "lucide-react";

type Role = "customer" | "barber" | "owner";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function RoleCard({
  title,
  description,
  icon,
  isSelected,
  onSelect,
  index,
}: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`group relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
        isSelected
          ? "bg-forest text-white shadow-[0_8px_30px_rgba(186,255,0,0.25)] ring-2 ring-lime"
          : "bg-card text-card-foreground shadow-[0_4px_20px_rgba(28,58,42,0.08)] hover:shadow-[0_8px_30px_rgba(28,58,42,0.12)]"
      }`}
    >
      {/* Subtle gradient overlay on hover for non-selected */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-lime/0 to-lime/0 transition-all duration-300 group-hover:from-lime/5 group-hover:to-transparent" />
      )}

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            isSelected ? "bg-lime text-forest" : "bg-forest/10 text-forest group-hover:bg-forest group-hover:text-lime"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-serif text-xl ${
                isSelected ? "text-white" : "text-forest"
              }`}
            >
              {title}
            </h3>
            <motion.div
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: isSelected ? 0 : -5, opacity: isSelected ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight
                className={`h-5 w-5 ${isSelected ? "text-lime" : "text-forest"}`}
              />
            </motion.div>
          </div>
          <p
            className={`mt-1 text-sm leading-relaxed ${
              isSelected ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Selected indicator line */}
      {isSelected && (
        <motion.div
          layoutId="selectedIndicator"
          className="absolute bottom-0 left-0 h-1 w-full bg-lime"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}

interface RoleSelectorProps {
  value?: Role;
  onChange?: (role: Role) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const [internalRole, setInternalRole] = useState<Role>("customer");
  const selectedRole = value ?? internalRole;

  const handleSelect = (role: Role) => {
    setInternalRole(role);
    onChange?.(role);
  };

  const roles = [
    {
      role: "customer" as Role,
      title: "Customer",
      description: "Browse shops, join queues",
      icon: <Search className="h-6 w-6" />,
    },
    {
      role: "barber" as Role,
      title: "Barber",
      description: "Manage your queue",
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      role: "owner" as Role,
      title: "Shop Owner",
      description: "Manage your shop & team",
      icon: <Building2 className="h-6 w-6" />,
    },
  ];

  return (
    <div className="w-full space-y-3">
      {roles.map((role, index) => (
        <RoleCard
          key={role.role}
          {...role}
          isSelected={selectedRole === role.role}
          onSelect={() => handleSelect(role.role)}
          index={index}
        />
      ))}
    </div>
  );
}
