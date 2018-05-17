package metrics;

import org.sonar.api.ce.measure.Measure;
import org.sonar.api.ce.measure.MeasureComputer;

import static metrics.MyMetrics.FILENAME_SIZE;
import static metrics.MyMetrics.FILENAME_SIZE_RATING;

public class ComputeSizeRating implements MeasureComputer {

    private static final int THRESHOLD = 20;
    private static final int RATING_A = 1;
    private static final int RATING_B = 2;

    public MeasureComputerDefinition define(MeasureComputerDefinitionContext def) {
        return def.newDefinitionBuilder()
                .setInputMetrics(FILENAME_SIZE.key())
                .setOutputMetrics(FILENAME_SIZE_RATING.key())
                .build();
    }

    public void compute(MeasureComputerContext context) {
        Measure size = context.getMeasure(FILENAME_SIZE.key());
        if (size != null) {
            // rating values are currently implemented as integers in API
            int rating = RATING_A;
            if (size.getIntValue() > THRESHOLD) {
                rating = RATING_B;
            }
            context.addMeasure(FILENAME_SIZE_RATING.key(), rating);
        }
    }
}
