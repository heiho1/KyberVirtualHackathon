import React, { PureComponent } from 'react';
import autobind from 'react-autobind';
import isEmpty from 'lodash/isEmpty';

import SurveyPageView2 from './SurveyPageView2';
import surveyList from '../../constants/SurveyQuestions';
import surveyResponse from '../../constants/SurveyResults';
import { registerEvent } from '../../api/googleAnalytics';
import { SURVEY_COMPLETED } from '../../constants/googleAnalytics';

class SurveyPageContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      answers: {},
      recommendedZaps: [],
      isLoading: false,
      surveyComplete: false,
      activeStep: 0,
      isResultsDisabled: true
    };
    autobind(this);
  }

  onAnswer = answer => {
    const { answers, activeStep } = this.state;
    this.setState(
      {
        answers: {
          ...answers,
          [activeStep]: answer
        }
      },
      () => this.calculateAnswerCount()
    );
    this.setActiveStep(this.state.activeStep + 1);
  };

  calculateAnswerCount = () => {
    const { answers } = this.state;
    if (answers[0] && answers[1] && answers[2] && answers[3]) {
      this.setState({ isResultsDisabled: false }, () => this.setActiveStep(4));
    }
  };

  setActiveStep = activeStep => {
    if (activeStep === 4) {
      const recommendedZaps = this.onCompletion();
      this.setState({ recommendedZaps });
    }
    this.setState({ activeStep });
  };

  moveToStep = step => this.setActiveStep(step);

  reDoSurvey = () => {
    this.setState({
      answers: {},
      recommendedZaps: [],
      isLoading: false,
      surveyComplete: false
    });
    this.setActiveStep(0);
  };

  onCompletion = () => {
    const { answers } = this.state;
    let strategy;
    if (
      !isEmpty(answers[0]) &&
      !isEmpty(answers[1]) &&
      !isEmpty(answers[2]) &&
      !isEmpty(answers[3])
    ) {
      strategy = surveyResponse[answers[0]][answers[1]][answers[2]][answers[3]];
    }
    return strategy;
  };

  submitResults = () => {
    registerEvent({
      category: SURVEY_COMPLETED,
      action: 'User clicked on Get Results.'
    });
    const recommendedZaps = this.onCompletion();
    this.setState({ isLoading: false, surveyComplete: true, recommendedZaps });
  };

  render() {
    const {
      isLoading,
      recommendedZaps,
      surveyComplete,
      activeStep,
      answers,
      isResultsDisabled
    } = this.state;

    return (
      <SurveyPageView2
        isLoading={isLoading}
        onAnswer={this.onAnswer}
        onCompletion={this.onCompletion}
        surveyList={surveyList}
        reDoSurvey={this.reDoSurvey}
        submitResults={this.submitResults}
        surveyComplete={surveyComplete}
        recommendedZaps={recommendedZaps}
        activeStep={activeStep}
        setActiveStep={this.setActiveStep}
        moveToStep={this.moveToStep}
        answers={answers}
        isResultsDisabled={isResultsDisabled}
      />
    );
  }
}

export default SurveyPageContainer;
