import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2a2f79',
        secondary: '#007642',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
});
