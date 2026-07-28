// src/components/Classes/ClassScheduler.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';

function ClassScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classes, setClasses] = useState([]);

  const addClass = (classData) => {
    // POST to /api/classes
    fetch('http://localhost:5053/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    })
    .then(res => res.json())
    .then(data => setClasses([...classes, data]));
  };

  return (
    <div className="class-scheduler">
      <h2>📅 Class Schedule</h2>
      <div className="calendar-wrapper">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>
      <div className="class-list">
        {classes.filter(c => 
          new Date(c.date).toDateString() === selectedDate.toDateString()
        ).map(cls => (
          <div key={cls.id} className="class-item">
            <h4>{cls.name}</h4>
            <p>Trainer: {cls.trainer}</p>
            <p>Time: {cls.time}</p>
            <p>Capacity: {cls.enrolled}/{cls.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}