import { Moment } from 'moment';
import type { NextPage } from 'next';
import Day from './day';

const Week: NextPage<{ days: Array<Moment>; week: number }> = ({ days, week }) => {
    return (
        <tr>
            {days.map((day, index) => <Day day={day} key={index} />)}
        </tr>
    );
};

export default Week;