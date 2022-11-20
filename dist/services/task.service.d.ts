import { CategoryService } from './category.service';
import { UserService } from './user.service';
export declare class TaskService {
    private userService;
    private categoryServive;
    constructor(userService: UserService, categoryServive: CategoryService);
    deleteInActives(): Promise<void>;
}
