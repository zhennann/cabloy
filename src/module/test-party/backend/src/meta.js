const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = require('./config/validation/schemas.js')(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          party: {
            info: {
              title: 'Party',
              tableName: 'testPartyView',
            },
            actions: {
              review: {
                code: 101,
                title: 'Review',
                flag: '1',
              },
            },
            flags: {
              1: {
                title: 'Reviewing',
              },
              2: {
                title: 'Reviewed',
              },
            },
            validator: 'party',
            search: {
              validator: 'partySearch',
            },
          },
        },
        functions: {
          createParty: {
            title: 'Create Party',
            scene: 'create',
            autoRight: 1,
            atomClassName: 'party',
            action: 'create',
            sorting: 1,
            menu: 1,
          },
          listParty: {
            title: 'Party List',
            scene: 'list',
            autoRight: 1,
            atomClassName: 'party',
            action: 'read',
            sorting: 1,
            menu: 1,
          },
        },
      },
      validation: {
        validators: {
          party: {
            schemas: 'party',
          },
          partySearch: {
            schemas: 'partySearch',
          },
        },
        keywords: {},
        schemas: {
          party: schemas.party,
          partySearch: schemas.partySearch,
        },
      },
    });
  }
  if (app.meta.isTest) {
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          partyPublic: {
            info: {
              tableName: 'testPartyPublic',
              public: 1,
              flow: 1,
            },
          },
        },
        functions: {
          testPublic: {
            scene: 'tools',
            menu: 1,
            public: 1,
          },
        },
      },
      event: {
        implementations: {
          'a-base:userVerify': 'test/eventUserVerify',
        },
      },
    });
  }
  return meta;
};
