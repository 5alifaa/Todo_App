import { tasks, task_tags } from '@prisma/client';

export class TaskSerializer {
  static serialize(
    task: tasks & { task_tags: (task_tags & { tags: { name: string } })[] },
  ) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      is_completed: task.is_completed,
      due_date: task.due_date,
      created_at: task.created_at,
      updated_at: task.updated_at,
      user_id: task.user_id,
      tags: task.task_tags.map((tag) => tag.tags.name),
    };
  }
  static serializeArray(
    tasks: (tasks & {
      task_tags: (task_tags & { tags: { name: string } })[];
    })[],
  ) {
    return tasks.map((task) => this.serialize(task));
  }
}
