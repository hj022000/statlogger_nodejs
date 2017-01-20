/**
 * Created by looper on 2017/01/12.
 */
/**
 * 任务类型模块
 * @type {TaskType}
 */
module.exports = TaskType;

function TaskType() {

}
/**
 * 为任务类型创建类属性
 * @type {number}
 */
TaskType.TASK_BEGIN = 0;
TaskType.TASK_NEWBIE = 1;    //新手任务
TaskType.TASK_STORY = 2;    //主线任务
TaskType.TASK_SUPPLEMENT = 3;  //支线任务
TaskType.TASK_END = 4;