export class QuizConfig {
    allowBack: boolean;
    autoMove: boolean;  // if boolean; it will move to next question automatically when answered.
    pageSize: number;
    requiredAll: boolean;  // indicates if you must answer all the questions before submitting.
    showPager: boolean;

    constructor(data: any) {
        data = data || {};
        this.allowBack = data.allowBack;
        this.autoMove = data.autoMove;
        this.pageSize = data.pageSize;
        this.requiredAll = data.requiredAll;
    }
}
