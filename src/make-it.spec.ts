import 'reflect-metadata';
import { makeIt, mapping } from './make-it';

class Person {
    id!: string;
    name!: string;
    child!: Person;
    state?: boolean;
}

test('basic', () => {
    const ali = new Person();
    ali.id = '1';
    ali.name = 'ali';

    expect(makeIt(Person, { id: '1', name: 'ali' })).toStrictEqual(ali);
    expect(makeIt(Object, { id: '1', name: 'ali' })).toEqual(ali);
    expect(makeIt(Object, { id: '1', name: 'ali' })).not.toStrictEqual(ali);
});

test('basic', () => {
    const ali = new Person();
    ali.id = '1';
    ali.name = 'ali';
    ali.state = undefined;

    expect(makeIt(Person, { id: '1', name: 'ali' })).toEqual(ali);
    expect(makeIt(Person, { id: '1', name: 'ali' })).not.toStrictEqual(ali);
});

test('basic', () => {
    const ali = new Person();
    ali.id = '1';
    ali.name = 'ali';
    ali.state = false;

    expect(makeIt(Person, { id: '1', name: 'ali', state: false })).toStrictEqual(ali);
    expect(makeIt(Person, { id: '1', name: 'ali', start: true })).not.toEqual(ali);
});

test('nested', () => {
    const ali = new Person();
    ali.id = '1';
    ali.name = 'ali';

    const mohammad = new Person();
    mohammad.id = '2';
    mohammad.name = 'mohammad';

    ali.child = mohammad;

    expect(
        makeIt(Person, {
            id: '1',
            name: 'ali',
            child: { id: '2', name: 'mohammad' },
        }),
    ).toEqual(ali);
    expect(
        makeIt(Person, {
            id: '1',
            name: 'ali',
            child: { id: '2', name: 'mohammad' },
        }),
    ).not.toStrictEqual(ali);
    expect(
        makeIt(Person, {
            id: '1',
            name: 'ali',
            child: { id: '2', name: 'mohammad' },
        }).child,
    ).toEqual(ali.child);
    expect(
        makeIt(Person, {
            id: '1',
            name: 'ali',
            child: { id: '2', name: 'mohammad' },
        }).child,
    ).not.toStrictEqual(ali.child);
});

class PersonMap {
    @mapping({ default: 0 })
    id!: string;
    @mapping({ property: 'name', default: 'ali' })
    name!: string;
    @mapping({ nested: true, type: Person })
    child!: PersonMap;
}

test('mapping', () => {
    const ali = new Person();
    ali.id = '1';
    ali.name = 'ali';

    const mohammad = new Person();
    mohammad.id = '2';
    mohammad.name = 'mohammad';

    ali.child = mohammad;

    const personMap = new PersonMap();
    personMap.id = '1';
    personMap.child = new PersonMap();
    personMap.child.id = '2';
    personMap.child.name = 'mohammad';

    expect(makeIt(Person, personMap)).toStrictEqual(ali);
    expect(makeIt(Person, personMap).child).toStrictEqual(ali.child);
});
