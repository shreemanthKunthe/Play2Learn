import React from 'react';
import './SubjectSelect.css';
import InfiniteMenu from './InfiniteMenu';

const SUBJECTS = [
  {
    key: 'Game Based Aptitude',
    title: 'Game Based Aptitude',
    desc: 'Visual pattern puzzles with shapes and colors.',
    color: '#8a2be2',
    image: '/Images/gd.png'
  },
  {
    key: 'Company Questions',
    title: 'Company Questions',
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
