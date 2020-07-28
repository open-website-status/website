<template>
  <v-main>
    <not-connected-container v-if="!$typedStore.state.connected" />
    <v-container
      v-else
      class="fill-height flex-column justify-center align-stretch home-container"
    >
      <h1 class="mb-6 text-h5 text-sm-h3">
        Check website status...
      </h1>
      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="url"
          solo
          rounded
          solo-inverted
          label="URL adress"
          placeholder="https://example.com"
          autofocus
          hint="Press enter to check"
          :readonly="loading"
          :error-messages="urlErrors"
          type="url"
        />
        <div class="d-flex justify-end">
          <v-btn
            rounded
            :large="$vuetify.breakpoint.smAndUp"
            outlined
            type="submit"
            :disabled="!submitEnabled"
            class="mr-3"
            :to="historyRoute"
          >
            View history
          </v-btn>
          <v-btn
            rounded
            :large="$vuetify.breakpoint.smAndUp"
            color="primary"
            type="submit"
            :disabled="!submitEnabled"
          >
            Check
          </v-btn>
        </div>
      </v-form>
      <v-alert
        class="mt-7"
        color="error"
        icon="mdi-alert-circle"
        :value="captchaError"
        transition="slide-x-transition"
      >
        Sorry, there was an error with reCAPTCHA
      </v-alert>
      <v-alert
        class="mt-7"
        color="error"
        icon="mdi-alert-circle"
        :value="error !== null"
        transition="slide-x-transition"
      >
        {{ error }}
      </v-alert>
      <template v-if="$typedStore.state.connectedProvidersCount !== null">
        <v-alert
          v-if="$typedStore.state.connectedProvidersCount === 0"
          text
          class="mt-7"
          :class="{
            'shake': shakeNoProviders
          }"
          color="error"
          icon="mdi-alert"
        >
          There are no active providers. You will only be able to see history
        </v-alert>
        <v-alert
          v-else-if="$typedStore.state.connectedProvidersCount === 1"
          text
          class="mt-7"
          color="warning"
          icon="mdi-information"
        >
          There is one active provider
        </v-alert>
        <v-alert
          v-else
          text
          class="mt-7"
          icon="mdi-information"
        >
          There are {{ $typedStore.state.connectedProvidersCount }} active providers
        </v-alert>
      </template>
    </v-container>
    <v-overlay
      absolute
      :value="loading"
    >
      <v-progress-circular
        indeterminate
        :size="96"
        color="primary"
      />
    </v-overlay>
    <vue-recaptcha
      ref="recaptcha"
      :sitekey="recaptchaSiteKey"
      load-recaptcha-script
      size="invisible"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
      @error="onCaptchaError"
    />
  </v-main>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import VueRecaptcha from 'vue-recaptcha';
  import _ from 'lodash';
  import NotConnectedContainer from '@/components/NotConnectedContainer.vue';

  @Component({
    components: {
      NotConnectedContainer,
      VueRecaptcha,
    },
  })
  export default class Home extends Vue {
    $refs!: {
      recaptcha: VueRecaptcha;
    }

    get recaptchaSiteKey () {
      return process.env.VUE_APP_RECAPTCHA_SITEKEY;
    }

    async submit (): Promise<void> {
      if (!this.submitEnabled) return;
      if (this.loading) return;

      if (this.$typedStore.state.connectedProvidersCount === 0) {
        if (!this.shakeNoProviders) {
          this.shakeNoProviders = true;
          await new Promise((resolve) => setTimeout(resolve, 750));
          this.shakeNoProviders = false;
        }
        return;
      }

      this.loading = true;

      if (this.recaptchaResponse === null) {
        this.$refs.recaptcha.execute();
      } else {
        await this.checkWebsite();
      }
    }

    async checkWebsite (): Promise<void> {
      const url = new URL(this.url.trim());

      if (this.recaptchaResponse === null) {
        console.error('No captcha response');
        this.captchaError = true;
        this.loading = false;
        return;
      }

      const data = {
        reCaptchaResponse: this.recaptchaResponse,
        subscribe: true,
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port === '' ? undefined : parseInt(url.port),
        pathname: url.pathname,
        search: url.search,
      };

      try {
        const query = await this.$api.query(data);
        await this.$router.push(`/query-details/${query.id}`);
      } catch (error) {
        console.error(error);
        this.error = error.message;
      }

      this.loading = false;
    }

    get submitEnabled (): boolean {
      return this.url.trim() !== '' && this.urlErrors.length === 0;
    }

    get urlErrors () {
      if (this.url.trim() === '') return [];
      try {
        const url = new URL(this.url.trim());
        if (!['http:', 'https:'].includes(url.protocol)) return ['The only supported protocols are http: and https:'];
        if (url.username !== '' || url.password !== '') return ['You cannot check a URL with username or password'];
      } catch (error) {
        return ['This URL appears to be invalid'];
      }
      return [];
    }

    get historyRoute () {
      return `/history/${encodeURIComponent(this.url)}`;
    }

    url = '';

    loading = false;

    recaptchaResponse: null | string = null;

    captchaError = false;

    error: null | string = null;

    shakeNoProviders = false;

    async onCaptchaVerify (response: string) {
      this.recaptchaResponse = response;
      await this.checkWebsite();
      this.captchaError = false;
    }

    onCaptchaExpired () {
      this.recaptchaResponse = null;
      this.loading = false;
    }

    onCaptchaError () {
      this.recaptchaResponse = null;
      this.loading = false;
      this.captchaError = true;
    }

    created () {
      const search: string | (string | null)[] | undefined = this.$route.query?.q;
      if (_.isString(search)) this.url = search;
    }
  }
</script>

<style lang="scss">
  .home-container {
    max-width: 850px !important;

    .shake {
      animation: forwards shake 700ms;
    }
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
