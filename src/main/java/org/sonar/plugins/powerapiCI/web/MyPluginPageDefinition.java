package org.sonar.plugins.powerapiCI.web;

import org.sonar.api.web.page.Context;
import org.sonar.api.web.page.Page;
import org.sonar.api.web.page.Page.Scope;
import org.sonar.api.web.page.PageDefinition;

public class MyPluginPageDefinition implements PageDefinition {

    @Override
    public void define(Context context) {
        context
                 .addPage(Page.builder("powerapiCI/powerapiCI_page")
                        .setName("PowerapiCI stat")
                        .setScope(Scope.COMPONENT).build());
    }
}
