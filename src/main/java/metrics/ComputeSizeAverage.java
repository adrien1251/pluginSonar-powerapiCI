package metrics;

import org.sonar.api.ce.measure.Component;
import org.sonar.api.ce.measure.Measure;
import org.sonar.api.ce.measure.MeasureComputer;

import static metrics.MyMetrics.FILENAME_SIZE;

public class ComputeSizeAverage implements MeasureComputer {

    public MeasureComputerDefinition define(MeasureComputerDefinitionContext def) {
        return def.newDefinitionBuilder()
                .setOutputMetrics(FILENAME_SIZE.key())
                .build();
    }

    public void compute(MeasureComputerContext context) {
        // measure is already defined on files by {@link SetSizeOnFilesSensor}
        // in scanner stack
        if (context.getComponent().getType() != Component.Type.FILE) {
            int sum = 0;
            int count = 0;
            for (Measure child : context.getChildrenMeasures(FILENAME_SIZE.key())) {
                sum += child.getIntValue();
                count++;
            }
            int average = count == 0 ? 0 : sum / count;
            context.addMeasure(FILENAME_SIZE.key(), average);
        }
    }
}