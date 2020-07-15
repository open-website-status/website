<template>
  <v-main>
    <v-container class="fill-height flex-column justify-center align-stretch home-container">
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
            :to="`/history/${url}`"
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
        v-if="activeProviderCount === 0"
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
        v-else-if="activeProviderCount === 1"
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
        There are {{ activeProviderCount }} active providers
      </v-alert>
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
      sitekey="6LcZia0ZAAAAAJIfAAU6gZ_y3NuN3dTwWe_ZtZ_3"
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

  @Component({
    components: { VueRecaptcha },
  })
  export default class Home extends Vue {
    $refs!: {
      recaptcha: VueRecaptcha;
    }

    async submit (): Promise<void> {
      if (!this.submitEnabled) return;
      if (this.loading) return;

      if (this.activeProviderCount === 0) {
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
      console.log(url);

      await new Promise((resolve) => setTimeout(resolve, 3000));

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

    url = '';

    loading = false;

    activeProviderCount = 0;

    recaptchaResponse: null | string = null;

    captchaError = false;

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