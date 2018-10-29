import times from "lodash/times";
import round from "lodash/round";

const intDiv = (numerator, denomenator) => {
  const quotient = Math.trunc(numerator / denomenator);
  const extra = numerator % denomenator;
  const parts = times(denomenator, () => quotient);
  const extras = intDivRaw(denomenator, extra);
  return parts.map((quotient, index) => quotient + extras[index]);
};

export default intDiv;

export const intDivRaw = (count, extra) => {
  const extras = times(count, () => 0);
  if (extra > 0) {
    // The number of parts that will not need any extra added to them.
    const totalGap = count - extra;
    // The number of gaps to distribute the totalGap among.
    const gaps = totalGap < extra ? extra - 1 : extra + 1;
    // The width of each gap (likely not an integer).
    const gapWidth = totalGap / gaps;

    const offset = totalGap < extra ? 0 : gapWidth;

    // console.log("--------------------------------------");
    // console.log({
    //   count,
    //   extra,
    //   totalGap,
    //   gaps,
    //   gapWidth: round(gapWidth, 2),
    // });

    times(extra, extraIndex => {
      const extraIndexOffset = extraIndex + offset;
      const exactIndex = offset + gapWidth * extraIndex + extraIndex;
      const index = Math.round(exactIndex);
      // console.log({
      //   extraIndex,
      //   extraIndexOffset,
      //   exactIndex: round(exactIndex, 2),
      //   index,
      // });
      extras[index] += 1;
    });
  }
  return extras;
};
