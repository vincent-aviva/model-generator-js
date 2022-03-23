/**
 * Generated by '@kentico/kontent-model-generator@4.1.0' at 'Wed, 23 Mar 2022 13:53:23 GMT'
 */
export const projectModel = {
  languages: {
    cz: {
      codename: 'cz',
      name: 'cz',
    },
    en: {
      codename: 'en',
      name: 'English',
    },
  },
  contentTypes: {
    actor: {
      codename: 'actor',
      name: 'Actor',
      elements: {
        url: {
          codename: 'url',
          name: 'Url',
        },
        first_name: {
          codename: 'first_name',
          name: 'First name',
        },
        last_name: {
          codename: 'last_name',
          name: 'Last name',
        },
        photo: {
          codename: 'photo',
          name: 'Photo',
        },
      },
    },
    movie: {
      codename: 'movie',
      name: 'Movie',
      elements: {
        title: {
          codename: 'title',
          name: 'Title',
        },
        released: {
          codename: 'released',
          name: 'Released',
        },
        releasecategory: {
          codename: 'releasecategory',
          name: 'ReleaseCategory',
        },
        seoname: {
          codename: 'seoname',
          name: 'SeoName',
        },
        length: {
          codename: 'length',
          name: 'Length',
        },
        category: {
          codename: 'category',
          name: 'Category',
        },
        poster: {
          codename: 'poster',
          name: 'Poster',
        },
        stars: {
          codename: 'stars',
          name: 'Stars',
        },
        plot: {
          codename: 'plot',
          name: 'Plot',
        },
      },
    },
  },
  taxonomies: {
    movietype: {
      codename: 'movietype',
      name: 'MovieType',
      terms: {
        student: {
          codename: 'student',
          name: 'Student',
          terms: {},
        },
        film: {
          codename: 'film',
          name: 'Film',
          terms: {
            tv: {
              codename: 'tv',
              name: 'TV',
              terms: {},
            },
            blockbuster: {
              codename: 'blockbuster',
              name: 'Blockbuster',
              terms: {},
            },
            cinema_only: {
              codename: 'cinema_only',
              name: 'Cinema only',
              terms: {},
            },
          },
        },
      },
    },
    releasecategory: {
      codename: 'releasecategory',
      name: 'ReleaseCategory',
      terms: {
        global_release: {
          codename: 'global_release',
          name: 'Global release',
          terms: {},
        },
        us_only: {
          codename: 'us_only',
          name: 'US only',
          terms: {},
        },
        local_release: {
          codename: 'local_release',
          name: 'Local release',
          terms: {},
        },
      },
    },
  },
};
