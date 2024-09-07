import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { userFromStorage } from "@/utils/request";
import { RoleHintDisplay } from "..";
import { useTranslation } from "react-i18next";

export default function NewUserModal({ closeModal }) {
  const [error, setError] = useState(null);
  const [role, setRole] = useState("default");
  const { t } = useTranslation();
  
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { user, error } = await Admin.newUser(data);
    if (!!user) window.location.reload();
    setError(error);
  };

  const user = userFromStorage();

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            Add user to instance{t("audio.speech_provider.title")}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("account.username")}
                </label>
                <input
                  name="username"
                  type="text"
                  className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={t("account.username-placeholder")}
                  minLength={2}
                  required={true}
                  autoComplete="off"
                  pattern="^[a-z0-9_-]+$"
                  onInvalid={(e) =>
                    e.target.setCustomValidity(
                      `${t("account.username-description")}`                     
                    )
                  }
                  onChange={(e) => e.target.setCustomValidity("")}
                />
                <p className="mt-2 text-xs text-white/60">
                   {t("account.username-description")}
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("account.password")}
                </label>
                <input
                  name="password"
                  type="text"
                  className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={t("account.initial-password-placeholder")}
                  required={true}
                  autoComplete="off"
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  {t("account.password-description")}
                </p>
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("account.role")}
                </label>
                <select
                  name="role"
                  required={true}
                  defaultValue={"default"}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white border-gray-500 focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option value="default">{t("account.role.role-default")}</option>
                  <option value="manager">{t("account.role.role-manager")}</option>
                  {user?.role === "admin" && (
                    <option value="admin">{t("account.role.role-administrator")}</option>
                  )}
                </select>
                <RoleHintDisplay role={role} />
              </div>
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <p className="text-white text-xs md:text-sm">
                {t("account.after-create-user-msg")}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {t("account.add-user")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
