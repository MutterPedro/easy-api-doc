import Response from '../components/Response';
import Header, { HeaderProperties } from '../components/Header';
import MediaType, { MediaTypeProperties } from '../components/MediaType';
import Link, { LinkProperties } from '../components/Link';
import { SchemaProperties } from '../components/Schema';
import Schema from '../components/Schema';

type HeaderLiteralProperties = Omit<HeaderProperties, 'schema'> & { schema: SchemaProperties };
type MediaTypeLiteralProperties = Omit<MediaTypeProperties, 'schema'> & { schema: SchemaProperties };

export default class StatusBuilder {
  private readonly headers: Map<string, HeaderProperties> = new Map();
  private readonly contents: Map<string, MediaTypeProperties> = new Map();
  private readonly links: Map<string, LinkProperties> = new Map();

  private constructor(private readonly response: Response) {}

  static create(): StatusBuilder {
    return new StatusBuilder(new Response({}));
  }

  getResponse(): Response {
    return this.response;
  }

  withDescription(description: string): this {
    this.response.update({ description });

    return this;
  }

  withHeader(name: string, header: HeaderLiteralProperties): this {
    this.headers.set(name, { ...header, schema: new Schema(header.schema) });

    const content: { [key: string]: Header } = {};
    for (const [header, properties] of this.headers) {
      content[header] = new Header(properties);
    }

    this.response.update({
      headers: content,
    });

    return this;
  }

  withContent(mediaType: string, content: MediaTypeLiteralProperties): this {
    this.contents.set(mediaType, { ...content, schema: new Schema(content.schema) });

    const contents: { [key: string]: MediaType } = {};
    for (const [type, properties] of this.contents) {
      contents[type] = new MediaType(properties);
    }

    this.response.update({
      content: contents,
    });

    return this;
  }

  withLink(name: string, link: LinkProperties): this {
    this.links.set(name, link);

    const contents: { [key: string]: Link } = {};
    for (const [type, properties] of this.links) {
      contents[type] = new Link(properties);
    }

    this.response.update({
      links: contents,
    });

    return this;
  }
}
