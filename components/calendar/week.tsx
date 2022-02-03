import { Moment } from 'moment';
import type { NextPage } from 'next';
import type { months } from '../../pages/doc/calendar';
import Day from './day';

const Week: NextPage<{ days: Array<Moment>; month: months; }> = ({ days, month }) => {
    return (
        <tr>
            {days.map((day, index) => <Day day={day} key={index} month={month} />)}
        </tr>
    );
};

export default Week;