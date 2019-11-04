import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import isEmpty from 'lodash/isEmpty';

import NavigationBar from '../NavigationBar';
import styles from './SurveyPageView.module.css';
import ZapFullView from '../Zaps/ZapFullView';
import Zaps from '../../constants/Zaps';

const SurveyPageView = props => {
  const {
    questionNumber,
    onAnswer,
    surveyList,
    reDoSurvey,
    surveyComplete,
    submitResults,
    isLoading,
    answer
  } = props;

  const generateResult = () => {
    return isEmpty(answer) ? null : (
      <>
        <br /> <br />
        <h4>
          You might find this Zap useful: <br />
        </h4>
        <ZapFullView
          name={Zaps[answer].name}
          components={Zaps[answer].components}
          isOrderable={Zaps[answer].isOrderable}
          description={Zaps[answer].description}
        />
        <Row className="justify-content-center pb-3">
          <Button
            variant="outline-info"
            target="_blank"
            size="lg"
            href="https://defizap.typeform.com/to/UZSZg5"
            type="link"
            className="m-3"
          >
            Don&apos;t see your Zap? Submit a request and we will create one!
          </Button>
        </Row>
      </>
    );
  };

  const surveyCompleted = () => (
    <>
      <div key={questionNumber}>
        <Container>
          <NavigationBar />
          {surveyComplete ? (
            <>
              <Button
                variant="outline-dark"
                onClick={reDoSurvey}
                className={styles.buttonspacing}
                size="lg"
              >
                Start Over
              </Button>
              <Button variant="outline-dark" href="/zaps" size="lg">
                Explore all Zaps
              </Button>
            </>
          ) : (
            <Button
              variant="outline-dark"
              onClick={submitResults}
              className={styles.buttonspacing}
              size="lg"
            >
              Get Results
            </Button>
          )}
          {isLoading ? (
            <>
              <br />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
            </>
          ) : (
            generateResult()
          )}
        </Container>
      </div>
    </>
  );

  const questions = () => {
    const questionsList = surveyList.map(item => {
      return (
        <>
          <div key={questionNumber}>
            <Container key={questionNumber}>
              <NavigationBar />
              <h4>
                Answer a few multiple choice questions to see which Zap might
                fit your needs
              </h4>
              <br />
              <h4>{item.question}</h4>
              <h5 style={{ fontSize: 15 }}>
                Question {questionNumber} out of 4
              </h5>
              <ol type="A" style={{ width: '70%' }}>
                {item.options.map(option => {
                  return (
                    <li key={option.value} className="m-2">
                      <Button
                        variant="outline-dark"
                        size="lg"
                        onClick={() => onAnswer(option.key)}
                        block
                      >
                        {option.value}
                      </Button>
                    </li>
                  );
                })}
              </ol>
              <Row>
                <h5 style={{ fontSize: 15 }} className="m-3">
                  DISCLOSURE: THIS IS NOT INVESTMENT ADVICE. DO NOT MAKE
                  INVESTMENT DECISIONS SOLELY BASED ON <br />
                  RESULTS GENERATED BY THIS TOOL. THIS PROJECT IS IN BETA. USE
                  AT YOUR OWN DISCRETION.
                </h5>
              </Row>
            </Container>
          </div>
        </>
      );
    });
    return questionsList[questionNumber - 1];
  };

  const questionaire = () => {
    return (
      <div className={styles.background}>
        {surveyList.length >= questionNumber ? questions() : surveyCompleted()}
      </div>
    );
  };

  return questionaire(questionNumber);
};

export default SurveyPageView;
