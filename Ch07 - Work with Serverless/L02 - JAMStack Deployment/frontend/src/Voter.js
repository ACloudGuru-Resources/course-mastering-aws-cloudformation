import React, { useEffect, useState } from 'react';

import {
  XYPlot,
  XAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
} from 'react-vis';

import Sockette from 'sockette';
import styled from 'styled-components';
import Color from 'color';
import QRCode from 'qrcode';
import config from './config';

import sigilStark from './images/stark.png';
import sigilBaratheon from './images/baratheon.png';
import sigilTargaryen from './images/targaryen.png';
import sigilGreyjoy from './images/greyjoy.png';
import sigilLannister from './images/lannister.png';
import sigilTully from './images/tully.png';

let ws = null;

const Voter = () => {
  const [ballotsList, setBallotsList] = useState({
    Stark: 0,
    Baratheon: 0,
    Targaryen: 0,
    Greyjoy: 0,
    Lannister: 0,
    Tully: 0,
  });
  const [qrCode, setQrCode] = useState();

  const onVote = vote => {
    console.log('vote:', vote); // eslint-disable-line no-console
    ws.json({
      action: 'sendMessage',
      data: JSON.stringify(vote),
    });
  };

  const onMessageReceied = ({ data }) => {
    const voteData = JSON.parse(data);
    setBallotsList({ ...ballotsList, ...voteData });
  };

  const onConnection = e => {
    console.log('connection:', e); // eslint-disable-line no-console
    onVote('');
  };

  useEffect(() => {
    QRCode.toDataURL(config.site.url, { scale: 10 })
      .then(url => {
        setQrCode(url);
      })
      .catch(err => {
        console.error(err); // eslint-disable-line no-console
      });
  }, []);

  useEffect(() => {
    ws = new Sockette(config.site.api, {
      timeout: 5e3,
      maxAttempts: 1,
      onopen: e => onConnection(e),
      onmessage: e => onMessageReceied(e),
      onreconnect: e => console.log('Reconnecting...', e), // eslint-disable-line no-console
      onmaximum: e => console.log('Stop Attempting!', e), // eslint-disable-line no-console
      onclose: e => console.log('Closed!', e), // eslint-disable-line no-console
      onerror: e => console.log('Error:', e), // eslint-disable-line no-console
    });
    return function cleanup() {
      ws && ws.close();
      ws = null;
    };
  }, []);

  const colorMap = {
    Stark: '#414141',
    Baratheon: '#693813',
    Targaryen: '#9C1408',
    Greyjoy: '#302955',
    Lannister: '#ecad00',
    Tully: '#1b94b7',
  };

  const formatData = data =>
    Object.keys(data).map(key => ({
      y: key,
      x: data[key],
      color: colorMap[key],
    }));

  return (
    <VoterArea>
      <ChartBar>
        <ShortCuts>
          <StyledQR src={qrCode} alt="Scan Me" />
        </ShortCuts>
        <StyledChart width={600} height={400} yType="ordinal">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <HorizontalBarSeries
            animation
            colorType="literal"
            data={formatData(ballotsList)}
          />
        </StyledChart>
      </ChartBar>
      <VoterButtonBar>
        <VoterButton color="#414141">
          <VoterThumb
            src={sigilStark}
            alt="Stark"
            onClick={() => onVote('Stark')}
          />
        </VoterButton>
        <VoterButton color="#693813">
          <VoterThumb
            src={sigilBaratheon}
            alt="Baratheon"
            onClick={() => onVote('Baratheon')}
          />
        </VoterButton>
        <VoterButton color="#9C1408">
          <VoterThumb
            src={sigilTargaryen}
            alt="Targaryen"
            onClick={() => onVote('Targaryen')}
          />
        </VoterButton>
        <VoterButton color="#302955">
          <VoterThumb
            src={sigilGreyjoy}
            alt="Greyjoy"
            onClick={() => onVote('Greyjoy')}
          />
        </VoterButton>
        <VoterButton color="#ecad00">
          <VoterThumb
            src={sigilLannister}
            alt="Lannister"
            onClick={() => onVote('Lannister')}
          />
        </VoterButton>
        <VoterButton color="#1b94b7">
          <VoterThumb
            src={sigilTully}
            alt="Tully"
            onClick={() => onVote('Tully')}
          />
        </VoterButton>
      </VoterButtonBar>
    </VoterArea>
  );
};

const VoterArea = styled.div`
  display: grid;
  grid-template-rows: 3fr 1fr;
  height: 100%;
`;

const ChartBar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-self: center;
  justify-self: center;
  overflow: hidden;

  @media only screen and (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ShortCuts = styled.div`
  align-self: center;
  justify-self: center;
  text-align: center;
`;

const StyledQR = styled.img`
  display: none;

  @media only screen and (min-width: 992px) {
    display: block;
  }
`;

const StyledChart = styled(XYPlot)`
  align-self: center;
  justify-self: center;
  transform: scale(0.5);
  padding-right: 30px;

  @media only screen and (min-width: 768px) {
    transform: none;
  }
`;

const VoterButtonBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-self: end;

  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const VoterButton = styled.div`
  background-color: ${props => (props.color ? props.color : 'green')};

  :hover,
  :active {
    background-color: ${props =>
      props.color
        ? Color(props.color)
            .lighten(0.5)
            .hex()
        : Color('green')
            .lighten(0.5)
            .hex()};
    cursor: pointer;
  }
`;

const VoterThumb = styled.img`
  width: 100%;
`;

export default Voter;
