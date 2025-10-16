import React from 'react';
import './SubjectSelect.css';
import InfiniteMenu from './InfiniteMenu';

const SUBJECTS = [
  {
    key: 'Company Quizes',
    title: 'Company Quizes',
    desc: 'ES6+, DOM, async, and more.',
    color: '#f7df1e',
    image: '/Images/CQuiz.png'
  },
  {
    key: 'Aptitude',
    title: 'Aptitude',
    desc: 'Basics, OOP, data, and libs.',
    color: '#3776ab',
    image: '/Images/Aptitude.png'
  },
  {
    key: 'Web Development',
    title: 'Web Development',
    desc: 'Layouts, flex/grid, responsive.',
    color: '#ff6a00',
    image: '/Images/Web.png'
  },
];

export default function SubjectSelect() {

  const items = SUBJECTS.map((s) => ({
    image: s.image,
    link: `/arena?subject=${encodeURIComponent(s.key)}`,
    title: s.title,
    description: s.desc,
  }));

  return (
    <div className="subjects-page">
      <div className="infinite-wrap"><InfiniteMenu items={items} /></div>
    </div>
  );
}
