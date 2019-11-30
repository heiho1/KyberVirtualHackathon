import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import isEmpty from 'lodash/isEmpty';

import { StepLabel, StepContent, Collapse } from '@material-ui/core';
import NavigationBar from '../NavigationBar';
import styles from './SurveyPageView.module.css';
import ZapFullView from '../Zaps/ZapFullView';
import zaps from '../../constants/Zaps';
import { registerEvent } from '../../api/googleAnalytics';
import { GENERATE_ZAP, SURVEY_PAGE } from '../../constants/googleAnalytics';

const SurveyPageView = props => {
  const {
    questionNumber,
    onAnswer,
    surveyList,
    reDoSurvey,
    surveyComplete,
    submitResults,
    isLoading,
    answer,
    onCompletion,
    activeStep,
    setActiveStep
  } = props;

  const getZap = () => {
    return (
      <>
        <br /> <br />
        <h4>
          You might find this Zap useful: <br />
        </h4>
        <ZapFullView
          name={zaps[answer].name}
          components={zaps[answer].components}
          isOrderable={zaps[answer].isOrderable}
          description={zaps[answer].description}
        />
        <Row className="justify-content-center pb-3">
          <Button
            variant="info"
            target="_blank"
            size="lg"
            href="https://defizap.typeform.com/to/UZSZg5"
            type="link"
            className="m-3"
            block
            onClick={() =>
              registerEvent({
                category: GENERATE_ZAP,
                action: SURVEY_PAGE
              })}
          >
            Don&apos;t see your Zap? Submit a request and we will create one!
          </Button>
        </Row>
        <Row>
          <h5 style={{ fontSize: 15 }} className="mx-3">
            DISCLOSURE:
            <p>
              This is not Investment Advice. Do not make investment decisions
              solely based on results generated by this tool. This Project is in
              Beta. Use it at your own discretion.
            </p>
            <p>
              Please note that we are not licensed financial advisors under any
              law. Please consult your own independent investment advisor before
              making any investment decisions.
            </p>
          </h5>
        </Row>
      </>
    );
  };

  const generateResult = () => {
    return (
      <>
        <Button
          variant="outline-primary"
          onClick={reDoSurvey}
          className="mx-1 px-1"
          size="lg"
        >
          Start Over
        </Button>
        <Button
          variant="primary"
          onClick={submitResults}
          className="mx-3 px-3"
          size="lg"
        >
          Get Results
        </Button>
        {surveyComplete ? getZap() : null}
      </>
    );
  };

  const surveySteps = () => {
    return (
      <Collapse in={!surveyComplete}>
        {/* If orientation is horizontal, go with alternativeLabel
      Else go with a vertical and !alternativeLabel */}
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          style={{ backgroundColor: 'inherit' }}
        >
          {/* // Concating adds one more item to the list of questions and returns the new array */}
          {surveyList.map(question => {
            return (
              <Step key={question.questionNumber}>
                <StepLabel>
                  <h5>{question.question}</h5>
                </StepLabel>
                <StepContent>
                  <ol type="A">
                    {question.options.map(option => {
                      return (
                        <li key={option.value} className="m-3 pl-2 px-2">
                          <Button
                            variant="outline-primary"
                            size="auto"
                            onClick={() => onAnswer(option.key)}
                            className="shadow"
                            block
                          >
                            {option.value}
                          </Button>
                        </li>
                      );
                    })}
                  </ol>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Collapse>
    );
  };

  return (
    <Container>
      <NavigationBar />
      <h4>
        Answer a few multiple choice questions to see which Zap might fit your
        needs
      </h4>
      {surveySteps()}
      {activeStep === 4 ? generateResult() : null}
    </Container>
  );
};

export default SurveyPageView;
