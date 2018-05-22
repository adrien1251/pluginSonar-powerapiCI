/*
 * Example Plugin for SonarQube
 * Copyright (C) 2009-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.plugins.powerapiCI;

import org.sonar.api.Plugin;
import org.sonar.api.config.PropertyDefinition;
import org.sonar.plugins.powerapiCI.hooks.DisplayIssuesInScanner;
import org.sonar.plugins.powerapiCI.hooks.DisplayQualityGateStatus;
import org.sonar.plugins.powerapiCI.languages.FooLanguage;
import org.sonar.plugins.powerapiCI.languages.FooQualityProfile;
import org.sonar.plugins.powerapiCI.measures.ComputeSizeAverage;
import org.sonar.plugins.powerapiCI.measures.ComputeSizeRating;
import org.sonar.plugins.powerapiCI.measures.ExampleMetrics;
import org.sonar.plugins.powerapiCI.measures.SetSizeOnFilesSensor;
import org.sonar.plugins.powerapiCI.rules.CreateIssuesOnJavaFilesSensor;
import org.sonar.plugins.powerapiCI.rules.FooLintIssuesLoaderSensor;
import org.sonar.plugins.powerapiCI.rules.FooLintRulesDefinition;
import org.sonar.plugins.powerapiCI.rules.JavaRulesDefinition;
import org.sonar.plugins.powerapiCI.settings.FooLanguageProperties;
import org.sonar.plugins.powerapiCI.settings.HelloWorldProperties;
import org.sonar.plugins.powerapiCI.settings.SayHelloFromScanner;
import org.sonar.plugins.powerapiCI.web.MyPluginPageDefinition;

import static java.util.Arrays.asList;

/**
 * This class is the entry point for all extensions. It is referenced in pom.xml.
 */
public class PowerapiCIPlugin implements Plugin {

  @Override
  public void define(Context context) {
    // tutorial on hooks
    // http://docs.sonarqube.org/display/DEV/Adding+Hooks
    context.addExtensions(DisplayIssuesInScanner.class, DisplayQualityGateStatus.class);

    // tutorial on languages
    context.addExtensions(FooLanguage.class, FooQualityProfile.class);
    context.addExtension(FooLanguageProperties.getProperties());

    // tutorial on measures
    context
      .addExtensions(ExampleMetrics.class, SetSizeOnFilesSensor.class, ComputeSizeAverage.class, ComputeSizeRating.class);

    // tutorial on rules
    context.addExtensions(JavaRulesDefinition.class, CreateIssuesOnJavaFilesSensor.class);
    context.addExtensions(FooLintRulesDefinition.class, FooLintIssuesLoaderSensor.class);

    // tutorial on settings
    context
      .addExtensions(HelloWorldProperties.getProperties())
      .addExtension(SayHelloFromScanner.class);

    // tutorial on web extensions
    context.addExtension(MyPluginPageDefinition.class);

    context.addExtensions(asList(
      PropertyDefinition.builder("sonar.foo.file.suffixes")
        .name("Suffixes FooLint")
        .description("Suffixes supported by FooLint")
        .category("FooLint")
        .defaultValue("")
        .build()));
  }
}
