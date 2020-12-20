import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  checked = false;
  quizName: string;
  config: QuizConfig = {
    'allowBack': false,
    'autoMove': false, 
    'pageSize': 1,
    'requiredAll': false,  
    'showPager': true,
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
    });
    this.mode = 'quiz';
  }


  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    
    this.checked = true;

    if(this.isCorrect(question) == 'correct'){
      this.quiz.score = this.quiz.score + 1;
    }
    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
      this.checked = false;
    }
    if(index == this.pager.count) this.onSubmit();
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));
    console.log(this.quiz.questions);
    this.mode = 'result';
  }
}
