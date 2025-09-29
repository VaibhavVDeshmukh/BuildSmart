/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbilityBuilder, AbilityClass, PureAbility } from "@casl/ability";
import { ServiceActionIndexMap } from "../../data/const";
import { AppAbility, AuthService, ResourceAction } from "./types";
// Currently we are doing this hardcoded but later it will be in db with cached values in redis

// Define abilities based on permissions
export const defineAbilitiesFor = (permissions: number[] | string[]) => {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);

  const relations: { [key: string]: Set<ResourceAction> } = {};

  permissions.forEach((id) => {
    const actionAndService = ServiceActionIndexMap[id];
    if (actionAndService) {
      const [service, action] = actionAndService;
      if (!relations[service]) {
        relations[service] = new Set();
      }
      relations[service].add(action);
    }
  });

  for (const [service, actions] of Object.entries(relations)) {
    actions.forEach((action) => {
      can(action, service as AuthService);
    });
  }

  return build();
};
