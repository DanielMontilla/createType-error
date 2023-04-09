import { faker } from "@faker-js/faker";
import { s } from "sanity-typed-schema-builder";
import { z } from "zod"; // change zod version to "3.17.10" to make it work!

const muxVideo = () =>
  s.createType({
    // `schema` returns the sanity schema type
    schema: () => ({ type: "mux.video" } as const),

    // `mock` returns an instance of the native sanity value
    // `faker` will have a stable `seed` value
    mock: (faker) =>
      ({
        _type: "mux.video",
        asset: {
          _type: "reference",
          _ref: faker.datatype.uuid(),
        },
      } as const),

    // `zod` is used for parsing this type
    zod: z.object({
      _type: z.literal("mux.video"),
      asset: z.object({
        _type: z.literal("reference"),
        _ref: z.string(),
      }),
    }),

    // `zodResolved` is used for parsing into the resolved value
    // defaults to reusing `zod`
    zodResolved: z
      .object({
        _type: z.literal("mux.video"),
        asset: z.object({
          _type: z.literal("reference"),
          _ref: z.string(),
        }),
      })
      .transform(
        ({ asset: { _ref: playbackId } }) => resolvedValues[playbackId]
      ),
  });

const type = document({
  name: "foo",
  fields: [
    {
      name: "video",
      type: muxVideo(),
    },
  ],
});

const value = type.mock(faker);

/**
 * typeof value === {
 *   _createdAt: string;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: string;
 *   video: {
 *     _type: "mux.video";
 *     asset: {
 *       _ref: string;
 *       _type: "reference";
 *     };
 *   };
 * };
 */

const parsedValue: s.output<typeof type> = type.parse(value);

/**
 * typeof parsedValue === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   video: {
 *     _type: "mux.video";
 *     asset: {
 *       _ref: string;
 *       _type: "reference";
 *     };
 *   };
 * };
 */

const resolvedValue: s.resolved<typeof type> = type.resolve(value);

/**
 * typeof resolvedValue === {
 *   _createdAt: Date;
 *   _id: string;
 *   _rev: string;
 *   _type: "foo";
 *   _updatedAt: Date;
 *   video: (typeof resolvedValues)[string];
 * };
 */

const schema = type.schema();

/**
 * const schema = {
 *   name: "foo",
 *   type: "document",
 *   fields: [
 *     {
 *       name: "video",
 *       type: "mux.video",
 *     },
 *   ],
 * };
 */