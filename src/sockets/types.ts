export type Provider = {
  id: string;
  name: string;
  token: string;
}

export type ProviderListMessage = {
  data: Provider[];
}
