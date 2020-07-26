export type Provider = {
  id: string;
  name: string;
  token: string;
  creationTimestamp: string;
}

export type ProviderListMessage = {
  data: Provider[];
}
