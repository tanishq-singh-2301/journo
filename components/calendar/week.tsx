import { Moment } from 'moment';
import type { NextPage } from 'next';
import type { months } from '../../pages/doc/calendar';
import Day from './day';

const Week: NextPage<{ days: Array<Moment>; week: number; month: months }> = ({ days, week, month }) => {
    return (
        <tr>
            {days.map((day, index) => <Day day={day} key={index} month={month} />)}
        </tr>
    );
};

export default Week;