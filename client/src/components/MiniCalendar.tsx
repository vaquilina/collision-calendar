import { CaretLeft, CaretRight } from 'phosphor-solid-js';

export function MiniCalendar() {
  return (
    <div class='mini-calendar'>
      <header>
        <h4>September 2025</h4>
        <span>
          <button id='mini-cal-month-backward' class='small-button' type='button'>
            <CaretLeft size={12} />
          </button>
          <button id='mini-cal-month-forward' class='small-button' type='button'>
            <CaretRight size={12} />
          </button>
        </span>
      </header>
      <div class='week0'></div>
      <div class='week-number-container week1' data-week-of-year='20'></div>
      <div class='week-number-container week2' data-week-of-year='21'></div>
      <div class='week-number-container week3' data-week-of-year='22'></div>
      <div class='week-number-container week4' data-week-of-year='23'></div>
      <div class='week-number-container week5' data-week-of-year='24'></div>
      <div class='week-number-container week6' data-week-of-year='25'></div>
      <div class='day-of-week-container dow01'>
        <h6>S</h6>
      </div>
      <div class='day-of-week-container dow02'>
        <h6>M</h6>
      </div>
      <div class='day-of-week-container dow03'>
        <h6>T</h6>
      </div>
      <div class='day-of-week-container dow04'>
        <h6>W</h6>
      </div>
      <div class='day-of-week-container dow05'>
        <h6>T</h6>
      </div>
      <div class='day-of-week-container dow06'>
        <h6>F</h6>
      </div>
      <div class='day-of-week-container dow07'>
        <h6>S</h6>
      </div>
      <div class='mini-day-container day01'>
        <a href='#'>1</a>
      </div>
      <div class='mini-day-container day02'>
        <a href='#'>2</a>
      </div>
      <div class='mini-day-container day03'>
        <a href='#'>3</a>
      </div>
      <div class='mini-day-container day04'>
        <a href='#'>4</a>
      </div>
      <div class='mini-day-container day05'>
        <a href='#'>5</a>
      </div>
      <div class='mini-day-container day06'>
        <a href='#'>6</a>
      </div>
      <div class='mini-day-container day07'>
        <a href='#'>7</a>
      </div>
      <div class='mini-day-container day08'>
        <a href='#'>8</a>
      </div>
      <div class='mini-day-container day09'>
        <a href='#'>9</a>
      </div>
      <div class='mini-day-container day10'>
        <a href='#'>10</a>
      </div>
      <div class='mini-day-container day11'>
        <a href='#'>11</a>
      </div>
      <div class='mini-day-container day12'>
        <a href='#'>12</a>
      </div>
      <div class='mini-day-container day13'>
        <a href='#'>13</a>
      </div>
      <div class='mini-day-container day14'>
        <a href='#'>14</a>
      </div>
      <div class='mini-day-container day15'>
        <a href='#'>15</a>
      </div>
      <div class='mini-day-container day16'>
        <a href='#'>16</a>
      </div>
      <div class='mini-day-container day17'>
        <a href='#'>17</a>
      </div>
      <div class='mini-day-container day18'>
        <a href='#'>18</a>
      </div>
      <div class='mini-day-container day19'>
        <a href='#'>19</a>
      </div>
      <div class='mini-day-container day20'>
        <a href='#'>20</a>
      </div>
      <div class='mini-day-container day21'>
        <a href='#'>21</a>
      </div>
      <div class='mini-day-container day22'>
        <a href='#'>22</a>
      </div>
      <div class='mini-day-container day23'>
        <a href='#'>23</a>
      </div>
      <div class='mini-day-container day24'>
        <a href='#'>24</a>
      </div>
      <div class='mini-day-container day25'>
        <a href='#'>25</a>
      </div>
      <div class='mini-day-container day26'>
        <a href='#'>26</a>
      </div>
      <div class='mini-day-container day27'>
        <a href='#'>27</a>
      </div>
      <div class='mini-day-container day28'>
        <a href='#'>28</a>
      </div>
      <div class='mini-day-container day29'>
        <a href='#'>29</a>
      </div>
      <div class='mini-day-container day30'>
        <a href='#'>30</a>
      </div>
      <div class='mini-day-container day31'>
        <a href='#'>31</a>
      </div>
      <div class='mini-day-container day32'>
        <a href='#'>32</a>
      </div>
      <div class='mini-day-container day33'>
        <a href='#'>33</a>
      </div>
      <div class='mini-day-container day34'>
        <a href='#'>34</a>
      </div>
      <div class='mini-day-container day35'>
        <a href='#'>35</a>
      </div>
      <div class='mini-day-container day36'>
        <a href='#'>36</a>
      </div>
      <div class='mini-day-container day37'>
        <a href='#'>37</a>
      </div>
      <div class='mini-day-container day38'>
        <a href='#'>38</a>
      </div>
      <div class='mini-day-container day39'>
        <a href='#'>39</a>
      </div>
      <div class='mini-day-container day40'>
        <a href='#'>40</a>
      </div>
      <div class='mini-day-container day41'>
        <a href='#'>41</a>
      </div>
      <div class='mini-day-container day42'>
        <a href='#'>42</a>
      </div>
    </div>
  );
}
