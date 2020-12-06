/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "chai";
import "mocha";

import { AudienceSet } from "../src/constructor";
import type { Audience, Spectator } from "../src/index";

describe("AudienceSet", () => {
	const audience = new AudienceSet() as Audience.Iterable<Spectator<() => void>> & { members: Set<Spectator<() => void>> };
	beforeEach(() => audience.dissolve());

	it(`should remove all spectators when dissolved`, () => {
		// Tests may get reordered; we ensure that dissolve has been working.
		expect(audience.members.size).to.equal(0);

		audience.join({ fn() {} });
		audience.join({ fn() {} });
		audience.dissolve();

		expect(audience.members.size).to.equal(0);
	});

	it(`should join new spectators`, () => {
		const a = audience.join({ fn() {} });
		const b = audience.join({ fn() {} });

		expect(audience.members.has(a)).to.be.true;
		expect(audience.members.has(b)).to.be.true;
		expect(audience.members.size).to.equal(2);
	});

	it(`should not reorder previously joined spectators`, () => {
		const a = audience.join({ fn() {} });
		const b = audience.join({ fn() {} });
		const order = Array.from(audience.members);
		audience.join(a);
		expect(Array.from(audience.members)).to.deep.equal(order);
	});

	it(`should part existing spectators`, () => {
		const a = audience.join({ fn() {} });
		const b = audience.join({ fn() {} });
		audience.part(a);

		expect(Array.from(audience.members)).to.deep.equal([ b ]);
	});

	it(`should indicate joined spectators`, () => {
		const a = audience.join({ fn() {} });
		const b = { fn(): void {} };

		expect(audience.joined(a)).to.be.true;
		expect(audience.joined(b)).to.be.false;
	});

	it(`should be iterable`, () => {
		const a = audience.join({ fn() {} });
		const b = audience.join({ fn() {} });
		expect(Array.from(audience)).to.deep.equal([ a, b ]);
		const c = audience.join({ fn() {} });
		const d = audience.join({ fn() {} });
		expect(Array.from(audience)).to.deep.equal([ a, b, c, d ]);
		audience.part(c);
		expect(Array.from(audience)).to.deep.equal([ a, b, d ]);
		audience.join(c);
		expect(Array.from(audience)).to.deep.equal([ a, b, d, c ]);
	});

	it(`should not skip due to mutation during iteration`, () => {
		const a = audience.join({ fn() {} });
		const b = audience.join({ fn() {} });
		const c = audience.join({ fn() {} });

		const it = audience[Symbol.iterator]();
		expect(it.next().value).to.equal(a);
		audience.part(b);
		expect(it.next().value).to.equal(c);
		const d = audience.join({ fn() {} });
		audience.part(a);
		expect(it.next().value).to.equal(d);
	});
});
