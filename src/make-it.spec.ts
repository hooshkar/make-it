import 'reflect-metadata';
import { MakeIt } from './make-it';
import { MakeItMap } from './decorator';

class Person {
    id: number;
    name: string;
    @MakeItMap({ optional: true, nested: 'object', type: Person })
    parent: Person;
    @MakeItMap({ optional: true, nested: 'array', type: Person })
    children?: Person[];
    state?: boolean;
    @MakeItMap({ optional: true, nested: 'array', type: String })
    cats?: string[];
}

test('basic', () => {
    const ali = new Person();
    ali.id = 1;
    ali.name = 'ali';

    expect(MakeIt(Person, { id: 1, name: 'ali' })).toStrictEqual(ali);
    expect(MakeIt(Object, { id: 1, name: 'ali' })).toEqual(ali);
    expect(MakeIt(Object, { id: 1, name: 'ali' })).not.toStrictEqual(ali);
});

test('basic value', () => {
    const ali = new Person();
    ali.id = 1;
    ali.name = 'ali';
    ali.state = false;

    expect(MakeIt(Person, { id: 1, name: 'ali', state: false })).toStrictEqual(ali);
    expect(MakeIt(Person, { id: 1, name: 'ali', start: true })).not.toEqual(ali);
});

test('undefined value', () => {
    const ali = new Person();
    ali.id = 1;
    ali.name = 'ali';
    ali.state = undefined;

    const built = MakeIt(Person, { id: 1, name: 'ali' });

    expect(built).toEqual(ali);
    expect(built).not.toStrictEqual(ali);
});

test('object field', () => {
    const ali = new Person();
    ali.id = 1;
    ali.name = 'ali';

    const mohammad = new Person();
    mohammad.id = 2;
    mohammad.name = 'mohammad';

    ali.parent = mohammad;

    const built = MakeIt(Person, {
        id: 1,
        name: 'ali',
        parent: { id: 2, name: 'mohammad' },
    });

    expect(built).toStrictEqual(ali);
    expect(built.parent).toStrictEqual(ali.parent);
});

test('array field', () => {
    const ali = new Person();
    ali.id = 1;
    ali.name = 'ali';
    ali.cats = ['pishy', 'mishy'];

    const mohammad = new Person();
    mohammad.id = 2;
    mohammad.name = 'mohammad';

    ali.children = [mohammad];

    const built = MakeIt(Person, {
        id: 1,
        name: 'ali',
        cats: ['pishy', 'mishy'],
        children: [{ id: 2, name: 'mohammad' }],
    });

    expect(built).toStrictEqual(ali);
});
