import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CategoryService } from './category.service';
import { UserService } from './user.service';

@Injectable()
export class TaskService {
  constructor(
    private userService: UserService,
    private categoryServive: CategoryService,
  ) {}

  @Cron('* 55 23 * * *')
  async deleteInActives() {
    const users = await this.userService.getInActives();
    for (const user of users) {
      if (
        user.lastLoggedIn &&
        !user.isActive &&
        Date.now() - Date.parse(user.lastLoggedIn.toISOString()) >=
          1 * 2629800000
      ) {
        // If deactivated for 1 month
        await this.userService.deleteAccount(user._id);
        const userCategs = await this.categoryServive.getAll(user._id);
        for (const categ of userCategs) {
          await this.categoryServive.deleteCategory(categ._id, user._id);
        }
      }
    }
  }
}
