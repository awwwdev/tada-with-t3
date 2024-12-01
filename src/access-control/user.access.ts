import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { User } from "~/server/db/user.schema";

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
export function defineAbilitiesFor(user: User) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.id) can('create', 'Folder');
  can(['read', 'update', 'delete'], 'Folder', { authorId: user.id });

  if (user.id) can('create', 'List');
  can(['read', 'update', 'delete'], 'List', { authorId: user.id });

  if (user.id) can('create', 'Task');
  can(['read', 'update', 'delete'], 'Task', { authorId: user.id });

  can('add_task_to_list', 'List', {authorId : user.id});
  can('remove_task_from_list', 'List', {authorId : user.id});
  can('reorder_tasks_in_list', 'List', {authorId : user.id});

  return build();
}
