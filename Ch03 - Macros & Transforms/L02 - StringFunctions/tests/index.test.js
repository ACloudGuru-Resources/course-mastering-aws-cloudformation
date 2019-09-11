const macro = require('../src/index');
const data = require('./event.json');

const response = ({ fragment }) => ({
  requestId: '617b6d09-32cb-421d-ac8f-1507756e8ecd',
  status: 'success',
  fragment,
});
const event = ({ params }) => ({ ...data, params });
const { InputString } = data.params;

describe('📦 StringFunctions Macro Unit Tests', () => {
  it('Upper should work', () => {
    const params = {
      InputString,
      Operation: 'Upper',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'THIS IS A TEST INPUT STRING';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  it('Lower should work', () => {
    const params = {
      InputString,
      Operation: 'Lower',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'this is a test input string';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  it('Capitalize should work', () => {
    const params = {
      InputString,
      Operation: 'Capitalize',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'This is a test input String';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  it('Title should work', () => {
    const params = {
      InputString,
      Operation: 'Title',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'This Is A Test Input String';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  it('SwapCase should work', () => {
    const params = {
      InputString,
      Operation: 'SwapCase',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'THIS IS A TEST INPUT sTRING';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  it('Replace should work', () => {
    const params = {
      InputString,
      Operation: 'Replace',
      Old: ' ',
      New: '_',
    };
    macro.handler(event({ params }), {}, (err, resp) => {
      const fragment = 'this_is_a_test_input_String';
      expect(resp).toEqual(response({ fragment }));
    });
  });

  describe('Strip should work', () => {
    it('With Chars should work', () => {
      const params = {
        InputString,
        Operation: 'Strip',
        Chars: 'tghnif',
      };
      macro.handler(event({ params }), {}, (err, resp) => {
        const fragment = 's is a test input Str';
        expect(resp).toEqual(response({ fragment }));
      });
    });

    it('WitOut Chars should work', () => {
      const params = {
        InputString: `  ${InputString}  `,
        Operation: 'Strip',
      };
      macro.handler(event({ params }), {}, (err, resp) => {
        expect(resp).toEqual(response({ fragment: InputString }));
      });
    });
  });

  describe('MaxLength should work', () => {
    it('MaxLength with StripLeft should work', () => {
      const params = {
        InputString,
        Operation: 'MaxLength',
        Length: 4,
        StripFrom: 'Left',
      };
      macro.handler(event({ params }), {}, (err, resp) => {
        const fragment = 'ring';
        expect(resp).toEqual(response({ fragment }));
      });
    });

    it('MaxLength with StripRight should work', () => {
      const params = {
        InputString,
        Operation: 'MaxLength',
        Length: 4,
        StripFrom: 'Right',
      };
      macro.handler(event({ params }), {}, (err, resp) => {
        const fragment = 'this';
        expect(resp).toEqual(response({ fragment }));
      });
    });
  });
});
