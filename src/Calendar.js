import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import Button from './Button'

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  &:last-child {
    margin-bottom: 20px;
  }
  h3 {
    margin-left: 8px;
    margin-bottom: 0;
    margin-top: 2rem;
    font-weight: lighter;
    font-size: 1.5rem;
  }
  li {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 0;
    a {
      flex: 1;
      margin-right: 10px;
    }
    p {
      margin: 0;
    }
  }
  .nodata {
    margin-left: 8px;
    margin-top: 4px;
    opacity: 0.8;
  }
`;

const CalendarStyles = styled.div`
  @media (min-width: 920px) {
    flex-basis: 420px;
  }
  header {
    padding: 0 8px;
    h2 {
      font-size: 1.5rem;
      font-weight: normal;
      margin-top: 2.5rem;
      margin-bottom: 5px;
    }
    p {
      margin-top: 5px;
      opacity: .8;
    }
    .tabs {
      display: flex;
      margin-top: 2rem;

      button {
        border: 1px solid transparent;
        border-bottom-color: #ccc;
        border-radius: 4px 4px 0 0;
        margin: 0;
        padding: .5rem 0;
        width: 56px;
        &:hover {
          background-color: #eee;
        }
      }
      .selected {
        border-color: #ccc;
        border-bottom-color: transparent;
      }
      span {
        padding: .5rem 1rem;
      }
    }
  }
`;

function formatTime(timeStr) { 
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) {
    return '';
  }
  return format(date, 'HH:MM');
}

function CalendarDay ({group}) {
  return (
    <List>
      <p className="nodata">{group.animes.length ? '' : 'Sin capítulos este día'}</p>
      {group.animes.map(item => (
        <li key={item.slug + group.day + item.time}>
          <Link to={item.slug}>{item.title}</Link>
          <p>{formatTime(item.time)}</p>
        </li>
      ))}
    </List>
  )
}

const dayMap = {
  'Monday': 'Lunes',
  'Tuesday': 'Martes',
  'Wednesday': 'Miércoles',
  'Thursday': 'Jueves',
  'Friday': 'Viernes',
  'Saturday': 'Sábado',
  'Sunday': 'Domingo',
  'Today': 'Hoy'
}

const endpoint = "https://nyapi.fuken.xyz";
function Calendar() {
  const [day, setDay] = useState(0);
  const [calendar, setCalendar] = useState([]);
  useEffect(() => {
    async function innerFetch () {
      const url = `${endpoint}/calendar`;
      const res = await window.fetch(url);
      const json = await res.json();
      const calendar = json
        .map(g => {
          g.day_extra = g.day.split(' ')[1]
          g.day = g.day.split(' ')[0]
          if (g.day === 'Current')        g.day = 'Monday'
          else if (g.day === 'Monday')    g.day = 'Tuesday'
          else if (g.day === 'Tuesday')   g.day = 'Wednesday'
          else if (g.day === 'Wednesday') g.day = 'Thursday'
          else if (g.day === 'Thursday')  g.day = 'Friday'
          else if (g.day === 'Friday')    g.day = 'Saturday'
          else if (g.day === 'Saturday')  g.day = 'Sunday'
          return g
        })
      setCalendar(calendar);
      setDay(calendar.findIndex(g => g.day_extra === '(Today)') || 0)
    }
    innerFetch()
  }, [])

  const titles = calendar
    .map(group => (dayMap[group.day] || group.day || '').slice(0, 3))

  return ( 
    <CalendarStyles className="column calendar">
      <header>
        <h2>Calendario</h2>
        <p>Horario de emision de capitulos de HorribleSubs</p>
        <div className="tabs">
          {titles.map((text, index) => (
            <Button key={text} clear 
              onClick={() => setDay(index)}
              className={index === day ? 'selected' : ''}>
              {text}.
            </Button>
          ))}
        </div>
      </header>
      {calendar[day] && <CalendarDay group={calendar[day]} />}
    </CalendarStyles>
  );
}

export default Calendar;