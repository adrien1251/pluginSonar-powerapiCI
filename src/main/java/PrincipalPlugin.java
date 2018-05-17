import metrics.ComputeSizeAverage;
import metrics.ComputeSizeRating;
import metrics.MyMetrics;
import metrics.SetSizeOnFilesSensor;
import org.sonar.api.Plugin;
import org.sonar.api.config.PropertyDefinition;
import settings.HelloWorldProperties;
import settings.SayHelloFromScanner;

import static java.util.Arrays.asList;

public class PrincipalPlugin implements Plugin {

    public void define(Context context) {
        // tutorial on measures
        context.addExtensions(MyMetrics.class, SetSizeOnFilesSensor.class, ComputeSizeAverage.class, ComputeSizeRating.class);

        // tutorial on settings
        context.addExtensions(HelloWorldProperties.getProperties()).addExtension(SayHelloFromScanner.class);

        // tutorial on web extensions
        //context.addExtension(MyPluginPageDefinition.class);

        context.addExtensions(asList(
                PropertyDefinition.builder("sonar.foo.file.suffixes")
                        .name("Suffixes FooLint")
                        .description("Suffixes supported by FooLint")
                        .category("FooLint")
                        .defaultValue("")
                        .build()));

    }
}
